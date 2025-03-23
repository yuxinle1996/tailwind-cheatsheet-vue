/**
 * 复制文本到剪贴板
 * @param text 文本
 * @returns
 */
export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
