export const getFileName = (url, i) => {
  try { const clean = url.split("?")[0]; return decodeURIComponent(clean.slice(clean.lastIndexOf("/") + 1)) || `photo-${i+1}.jpg`; }
  catch { return `photo-${i+1}.jpg`; }
};

const fetchBlob = async (url) => {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`Failed ${res.status}`);
  return await res.blob();
};

/** Web Share with Files if available; else copy links. progressCb(done,total) optional */
export async function shareFilesOrCopy(images, idxs, progressCb) {
  const files = [];
  for (let i = 0; i < idxs.length; i++) {
    const idx = idxs[i];
    const blob = await fetchBlob(images[idx]);
    files.push(new File([blob], getFileName(images[idx], idx), { type: blob.type || "image/jpeg" }));
    progressCb?.(i+1, idxs.length);
  }
  if (navigator.canShare && navigator.canShare({ files })) {
    await navigator.share({ files, title: "Wedding Photos", text: "Sharing favorite moments 💍" });
  } else {
    await navigator.clipboard.writeText(idxs.map(i => images[i]).join("\n"));
  }
}
