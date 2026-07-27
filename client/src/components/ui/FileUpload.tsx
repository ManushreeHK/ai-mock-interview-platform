interface FileUploadProps {
  label: string;
  accept?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileUpload({
  label,
  accept = ".pdf,.doc,.docx",
  error,
  onChange,
}: FileUploadProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className={`w-full rounded-lg border px-4 py-3

        ${
          error
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUpload;