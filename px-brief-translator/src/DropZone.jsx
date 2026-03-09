import { useState, useRef, useCallback } from "react";

// ── Load libraries from CDN (avoids Vite worker config issues) ──

let pdfjsLibCache = null;
async function loadPdfJs() {
  if (pdfjsLibCache) return pdfjsLibCache;

  // Load pdf.js from CDN
  await new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve();
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
    script.type = "module";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  // Fallback: use the legacy build which works as a regular script
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const lib = window.pdfjsLib;
  if (lib) {
    lib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    pdfjsLibCache = lib;
  }
  return lib;
}

let mammothCache = null;
async function loadMammoth() {
  if (mammothCache) return mammothCache;

  await new Promise((resolve, reject) => {
    if (window.mammoth) return resolve();
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  mammothCache = window.mammoth;
  return mammothCache;
}

// ── File type handlers ──

async function extractTextFromPdf(file) {
  const pdfjsLib = await loadPdfJs();
  if (!pdfjsLib) throw new Error("Could not load PDF library");

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

async function extractTextFromDocx(file) {
  const mammoth = await loadMammoth();
  if (!mammoth) throw new Error("Could not load DOCX library");

  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromPlain(file) {
  return await file.text();
}

const SUPPORTED_TYPES = {
  "application/pdf": { extract: extractTextFromPdf, label: "PDF" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    extract: extractTextFromDocx,
    label: "Word",
  },
  "text/plain": { extract: extractTextFromPlain, label: "Text" },
  "text/markdown": { extract: extractTextFromPlain, label: "Markdown" },
  "text/csv": { extract: extractTextFromPlain, label: "CSV" },
  "text/rtf": { extract: extractTextFromPlain, label: "RTF" },
};

function getHandlerByExtension(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const extMap = {
    pdf: SUPPORTED_TYPES["application/pdf"],
    docx: SUPPORTED_TYPES[
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    txt: SUPPORTED_TYPES["text/plain"],
    md: SUPPORTED_TYPES["text/markdown"],
    csv: SUPPORTED_TYPES["text/csv"],
    rtf: SUPPORTED_TYPES["text/rtf"],
  };
  return extMap[ext] || null;
}

export default function DropZone({ onTextExtracted, children }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      setFileError("");
      setFileName(file.name);

      let handler = SUPPORTED_TYPES[file.type];
      if (!handler) {
        handler = getHandlerByExtension(file.name);
      }

      if (!handler) {
        setFileError(
          "Unsupported file type. Try PDF, DOCX, TXT, MD, or CSV."
        );
        setFileName("");
        return;
      }

      setIsProcessing(true);
      try {
        const text = await handler.extract(file);
        if (!text || text.trim().length === 0) {
          setFileError(
            "Couldn't extract text from this file. It may be image-based. Try a text-based document."
          );
          setFileName("");
        } else {
          onTextExtracted(text.trim());
        }
      } catch (err) {
        console.error("File extraction error:", err);
        setFileError(`Error reading file: ${err.message}`);
        setFileName("");
      } finally {
        setIsProcessing(false);
      }
    },
    [onTextExtracted]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
      e.target.value = "";
    },
    [handleFile]
  );

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`dropzone ${isDragging ? "dropzone-active" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md,.csv,.rtf"
        onChange={handleFileInput}
        style={{ display: "none" }}
      />

      {isDragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-overlay-content">
            <div className="dropzone-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <span>Drop your file here</span>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="dropzone-overlay">
          <div className="dropzone-overlay-content">
            <div className="spinner" />
            <span>Reading {fileName}...</span>
          </div>
        </div>
      )}

      {fileName && !isProcessing && !fileError && (
        <div className="dropzone-file-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Loaded from <strong>{fileName}</strong></span>
          <button
            className="dropzone-clear"
            onClick={() => {
              setFileName("");
              onTextExtracted("");
            }}
          >
            Clear
          </button>
        </div>
      )}

      {fileError && (
        <div className="dropzone-error-bar">
          <span>{fileError}</span>
          <button
            className="dropzone-clear"
            onClick={() => setFileError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {children}

      <div className="dropzone-hint">
        <span>
          Drag &amp; drop a file here, or{" "}
          <button className="dropzone-browse" onClick={openFilePicker}>
            browse
          </button>
        </span>
        <span className="dropzone-formats">PDF, DOCX, TXT, MD, CSV</span>
      </div>
    </div>
  );
}
