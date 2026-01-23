import { Router } from "express";
import axios, { AxiosError } from "axios";
import { logServiceCall } from "../middlewares/logging.middleware";

const router = Router();

// File service URLs - configurable via environment variables xd
const FILE_SERVICE_INIT_URL = process.env.FILE_SERVICE_INIT_URL || "http://localhost:3011";
const FILE_SERVICE_UPDATE_URL = process.env.FILE_SERVICE_UPDATE_URL || "http://localhost:3012";
const FILE_SERVICE_UPLOAD_URL = process.env.FILE_SERVICE_UPLOAD_URL || "http://localhost:3013";
const FILE_SERVICE_LIST_URL = process.env.FILE_SERVICE_LIST_URL || "http://localhost:3014";
const FILE_SERVICE_DOWNLOAD_URL = process.env.FILE_SERVICE_DOWNLOAD_URL || "http://localhost:3015";

// Initialize student folder structure
router.post("/init-student", async (req, res) => {
  try {
    logServiceCall("files", "init-student", req.body);
    const response = await axios.post(
      `${FILE_SERVICE_INIT_URL}/files/init-student`,
      req.body,
      {
        timeout: 10000,
      }
    );
    logServiceCall("files", "init-student", { status: "success", response: response.data });
    res.status(200).json(response.data);
  } catch (error: any) {
    const axiosError = error as AxiosError;
    logServiceCall("files", "init-student", {
      status: "error",
      message: axiosError.message,
      response: axiosError.response?.data,
      statusCode: axiosError.response?.status,
    });
    res.status(axiosError.response?.status || 500).json({
      message: "Failed to initialize student folder",
      error: axiosError.response?.data || axiosError.message,
    });
  }
});

// Update student folder name
router.put("/update-student-folder", async (req, res) => {
  try {
    logServiceCall("files", "update-student-folder", req.body);
    const response = await axios.put(
      `${FILE_SERVICE_UPDATE_URL}/files/update-student-folder`,
      req.body,
      {
        timeout: 10000,
      }
    );
    logServiceCall("files", "update-student-folder", { status: "success", response: response.data });
    res.status(200).json(response.data);
  } catch (error: any) {
    const axiosError = error as AxiosError;
    logServiceCall("files", "update-student-folder", {
      status: "error",
      message: axiosError.message,
      response: axiosError.response?.data,
      statusCode: axiosError.response?.status,
    });
    res.status(axiosError.response?.status || 500).json({
      message: "Failed to update student folder",
      error: axiosError.response?.data || axiosError.message,
    });
  }
});

// Upload file
router.post("/upload", async (req, res) => {
  try {
    logServiceCall("files", "upload", { filename: req.body.filename || "unknown" });
    const response = await axios.post(
      `${FILE_SERVICE_UPLOAD_URL}/files/upload`,
      req.body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds for file uploads
      }
    );
    logServiceCall("files", "upload", { status: "success", response: response.data });
    res.status(200).json(response.data);
  } catch (error: any) {
    const axiosError = error as AxiosError;
    logServiceCall("files", "upload", {
      status: "error",
      message: axiosError.message,
      response: axiosError.response?.data,
      statusCode: axiosError.response?.status,
    });
    res.status(axiosError.response?.status || 500).json({
      message: "Failed to upload file",
      error: axiosError.response?.data || axiosError.message,
    });
  }
});

// List files
router.get("/list", async (req, res) => {
  try {
    logServiceCall("files", "list", req.query);
    const response = await axios.get(
      `${FILE_SERVICE_LIST_URL}/files/list`,
      {
        params: req.query,
        timeout: 10000,
      }
    );
    logServiceCall("files", "list", { status: "success", count: response.data.count });
    res.status(200).json(response.data);
  } catch (error: any) {
    const axiosError = error as AxiosError;
    logServiceCall("files", "list", {
      status: "error",
      message: axiosError.message,
      response: axiosError.response?.data,
      statusCode: axiosError.response?.status,
    });
    res.status(axiosError.response?.status || 500).json({
      message: "Failed to list files",
      error: axiosError.response?.data || axiosError.message,
    });
  }
});

// Download file
router.get("/download", async (req, res) => {
  try {
    logServiceCall("files", "download", req.query);
    const response = await axios.get(
      `${FILE_SERVICE_DOWNLOAD_URL}/files/download`,
      {
        params: req.query,
        responseType: "stream",
        timeout: 30000,
      }
    );
    logServiceCall("files", "download", { status: "success" });
    response.data.pipe(res);
  } catch (error: any) {
    const axiosError = error as AxiosError;
    logServiceCall("files", "download", {
      status: "error",
      message: axiosError.message,
      response: axiosError.response?.data,
      statusCode: axiosError.response?.status,
    });
    res.status(axiosError.response?.status || 500).json({
      message: "Failed to download file",
      error: axiosError.response?.data || axiosError.message,
    });
  }
});

export default router;
