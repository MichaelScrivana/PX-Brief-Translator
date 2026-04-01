import { useState, useRef, useCallback, useEffect } from "react";

const MAX_IMAGES = 8; // 1 hero + 7 supplemental
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const ImageIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export { ImageIcon };

export default function ImagePanel({ images, onImagesChange }) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDraggingExternal, setIsDraggingExternal] = useState(false);
  const draggedRef = useRef(null);
  const fileInputRef = useRef(null);
  const externalDragCounter = useRef(0);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const addImages = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;

      const validFiles = Array.from(files)
        .filter((f) => ACCEPTED_TYPES.includes(f.type))
        .slice(0, remaining);

      const newImages = validFiles.map((file, i) => ({
        id: crypto.randomUUID?.() || `${Date.now()}-${i}`,
        file,
        preview: URL.createObjectURL(file),
        caption: "",
        position: images.length + i,
      }));

      onImagesChange([...images, ...newImages]);
    },
    [images, onImagesChange]
  );

  const removeImage = useCallback(
    (id) => {
      const img = images.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      const updated = images
        .filter((i) => i.id !== id)
        .map((img, i) => ({ ...img, position: i }));
      onImagesChange(updated);
    },
    [images, onImagesChange]
  );

  const updateCaption = useCallback(
    (id, caption) => {
      onImagesChange(images.map((img) => (img.id === id ? { ...img, caption } : img)));
    },
    [images, onImagesChange]
  );

  // ── External file drop (add images) ──
  const handlePanelDragEnter = (e) => {
    e.preventDefault();
    externalDragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDraggingExternal(true);
    }
  };

  const handlePanelDragLeave = (e) => {
    e.preventDefault();
    externalDragCounter.current--;
    if (externalDragCounter.current === 0) {
      setIsDraggingExternal(false);
    }
  };

  const handlePanelDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handlePanelDrop = (e) => {
    e.preventDefault();
    setIsDraggingExternal(false);
    externalDragCounter.current = 0;
    if (e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };

  // ── Internal reorder drag ──
  const handleReorderDragStart = (e, index) => {
    draggedRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    e.currentTarget.classList.add("image-slot-dragging");
  };

  const handleReorderDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedRef.current !== null && draggedRef.current !== index) {
      setDragOverIndex(index);
    }
  };

  const handleReorderDrop = (e, toIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const fromIndex = draggedRef.current;
    if (fromIndex === null || fromIndex === toIndex) {
      setDragOverIndex(null);
      return;
    }

    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onImagesChange(updated.map((img, i) => ({ ...img, position: i })));
    setDragOverIndex(null);
    draggedRef.current = null;
  };

  const handleReorderDragEnd = (e) => {
    e.currentTarget.classList.remove("image-slot-dragging");
    draggedRef.current = null;
    setDragOverIndex(null);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) addImages(e.target.files);
    e.target.value = "";
  };

  const heroImage = images[0] || null;
  const supplementalImages = images.slice(1);

  return (
    <div
      className="image-panel-inner"
      onDragEnter={handlePanelDragEnter}
      onDragLeave={handlePanelDragLeave}
      onDragOver={handlePanelDragOver}
      onDrop={handlePanelDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileInput}
        style={{ display: "none" }}
      />

      <div className="image-panel-header">
        <span className="image-panel-title">Case Study Images</span>
        {images.length > 0 && (
          <span className="image-panel-count">{images.length}/{MAX_IMAGES}</span>
        )}
      </div>

      {/* Hero Image Slot */}
      <div className="image-section-label">Hero Image</div>
      {heroImage ? (
        <div
          className={`image-slot hero-slot ${dragOverIndex === 0 ? "image-slot-drag-over" : ""}`}
          draggable
          onDragStart={(e) => handleReorderDragStart(e, 0)}
          onDragOver={(e) => handleReorderDragOver(e, 0)}
          onDrop={(e) => handleReorderDrop(e, 0)}
          onDragEnd={handleReorderDragEnd}
        >
          <div className="image-slot-preview">
            <img src={heroImage.preview} alt="Hero" className="image-thumbnail" />
            <span className="image-position-badge hero-badge">Hero</span>
            <button className="image-remove-btn" onClick={() => removeImage(heroImage.id)} title="Remove">
              &times;
            </button>
          </div>
        </div>
      ) : (
        <div className="image-add-zone hero-add-zone" onClick={openFilePicker}>
          <ImageIcon size={24} />
          <span>Drop or click to add hero image</span>
        </div>
      )}

      {/* Supplemental Images */}
      <div className="image-section-label">
        Supplemental Images
        <span className="image-section-count">{supplementalImages.length}/7</span>
      </div>

      <div className="image-slots-list">
        {supplementalImages.map((img, i) => {
          const arrayIndex = i + 1; // index in the full images array
          return (
            <div
              key={img.id}
              className={`image-slot ${dragOverIndex === arrayIndex ? "image-slot-drag-over" : ""}`}
              draggable
              onDragStart={(e) => handleReorderDragStart(e, arrayIndex)}
              onDragOver={(e) => handleReorderDragOver(e, arrayIndex)}
              onDrop={(e) => handleReorderDrop(e, arrayIndex)}
              onDragEnd={handleReorderDragEnd}
            >
              <div className="image-slot-preview">
                <img src={img.preview} alt={`Image ${i + 1}`} className="image-thumbnail" />
                <span className="image-position-badge">{i + 1}</span>
                <button className="image-remove-btn" onClick={() => removeImage(img.id)} title="Remove">
                  &times;
                </button>
              </div>
              <textarea
                className="image-caption-input"
                value={img.caption}
                onChange={(e) => updateCaption(img.id, e.target.value)}
                placeholder={`Image ${i + 1} caption...`}
                rows={2}
              />
            </div>
          );
        })}
      </div>

      {/* Add more images */}
      {images.length < MAX_IMAGES && (
        <div className={`image-add-zone ${isDraggingExternal ? "image-add-zone-active" : ""}`} onClick={openFilePicker}>
          <ImageIcon size={20} />
          <span>{images.length === 0 ? "Drop images here or click to browse" : "Add more images"}</span>
          <span className="image-add-formats">JPG, PNG, WebP, GIF</span>
        </div>
      )}

      {isDraggingExternal && (
        <div className="image-panel-drop-overlay">
          <ImageIcon size={32} />
          <span>Drop images here</span>
        </div>
      )}
    </div>
  );
}
