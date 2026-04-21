import { useState, useRef } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{
    ok: boolean;
    key?: string;
    msg?: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (f && f.name.endsWith(".csv")) setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      setStatus(
        res.ok
          ? { ok: true, key: data.s3_key }
          : { ok: false, msg: data.detail?.errors?.join(", ") }
      );
    } catch {
      setStatus({ ok: false, msg: "Could not reach backend" });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Upload CSV | Json</h2>

      {/* drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <p className="text-gray-500 text-sm">
          drag & drop or{" "}
          <span className="text-blue-600 font-medium">browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">.csv or .Json only</p>
      </div>

      {/* file pill */}
      {file && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-gray-100 rounded-lg">
          <span className="flex-1 text-sm font-mono truncate">{file.name}</span>
          <span className="text-xs text-gray-400 font-mono">
            {(file.size / 1024).toFixed(1)} KB
          </span>
          <span
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-red-400 cursor-pointer text-lg leading-none"
          >
            ×
          </span>
        </div>
      )}

      <button
        onClick={upload}
        disabled={!file}
        className="mt-4 w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Upload
      </button>

      {/* result */}
      {status && (
        <div
          className={`mt-3 px-3 py-2 rounded-lg text-sm ${
            status.ok
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status.ok ? `✓ ${status.key}` : `✗ ${status.msg}`}
        </div>
      )}
    </div>
  );
}