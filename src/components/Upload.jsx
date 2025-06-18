import { useRef } from "react";
import { toast } from "react-toastify";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";

const authenticator = async () => {
  try {
    // Perform the request to the upload authentication endpoint.
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`
    );
    if (!response.ok) {
      // If the server response is not successful, extract the error text for debugging.
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse and destructure the response JSON for upload credentials.
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    // Log the original error for debugging before rethrowing a new error.
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

const Upload = ({ setProgress, children, type, setData }) => {
  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();
  const handleUpload = async (event) => {
    //prevent default button behavior
    event.preventDefault();

    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.warn("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      toast.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
          if (event.loaded === event.total) {
            toast.success("Upload completed successfully!");
          }
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });

      setData(uploadResponse.filePath);
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept={`${type}/*`}
        onChange={handleUpload}
        style={{ display: "none" }}
      />
      <div className="" onClick={() => fileInputRef.current?.click()}>
        {children}
      </div>
    </>
  );
};

export default Upload;
