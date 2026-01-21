# Asociar IPs Elásticas Manualmente

Como las cuentas académicas de AWS no tienen acceso completo a IAM, las IPs elásticas deberán asociarse manualmente a las instancias después de crearlas.

## Opción 1: Usando AWS Console

1. Ve a **EC2 Console** → **Elastic IPs**
2. Selecciona una IP elástica disponible
3. Click en **Actions** → **Associate Elastic IP address**
4. Selecciona la instancia a la cual asociar
5. Repite para las demás instancias

## Opción 2: Usando AWS CLI

```bash
# Listar instancias en el ASG
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=users-instance" \
  --query 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress,State.Name]' \
  --output table \
  --profile count1

# Listar IPs elásticas disponibles
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null].[AllocationId,PublicIp]' \
  --output table \
  --profile count1

# Asociar IP elástica a una instancia
aws ec2 associate-address \
  --instance-id i-1234567890abcdef0 \
  --allocation-id eipalloc-1234567890abcdef0 \
  --profile count1
```

## Opción 3: Script Bash para Asociar Automáticamente

Crea un script `asociar-eip.sh`:

```bash
#!/bin/bash
PROFILE=$1  # Ejemplo: count1, count2, etc.
TAG_NAME=$2  # Ejemplo: users-instance, auth-instance, etc.

# Obtener instancias en ejecución con el tag
INSTANCES=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=$TAG_NAME" "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].InstanceId' \
  --output text \
  --profile $PROFILE)

# Obtener IPs elásticas disponibles
EIPS=$(aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null].AllocationId' \
  --output text \
  --profile $PROFILE)

# Convertir a arrays
INSTANCE_ARRAY=($INSTANCES)
EIP_ARRAY=($EIPS)

# Asociar IPs a instancias
for i in "${!INSTANCE_ARRAY[@]}"; do
  if [ $i -lt ${#EIP_ARRAY[@]} ]; then
    echo "Asociando ${EIP_ARRAY[$i]} a ${INSTANCE_ARRAY[$i]}"
    aws ec2 associate-address \
      --instance-id ${INSTANCE_ARRAY[$i]} \
      --allocation-id ${EIP_ARRAY[$i]} \
      --profile $PROFILE
  fi
done
```

Uso:
```bash
chmod +x asociar-eip.sh
./asociar-eip.sh count1 users-instance
./asociar-eip.sh count2 auth-instance
./asociar-eip.sh count3 docs-instance
./asociar-eip.sh count4 edge-instance
./asociar-eip.sh count5 frontend-instance
```

## Nota Importante

El script en `user_data` intentará asociar IPs automáticamente, pero fallará silenciosamente si no hay permisos IAM. Esto no afectará el arranque de las instancias, pero las IPs deberán asociarse manualmente.
