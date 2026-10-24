export function safeNext(next: string | string[] | undefined): string {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(next)
  ) {
    return "/dashboard";
  }

  try {
    const destination = new URL(next, "https://ethioexam.invalid");
    const decodedPath = decodeURIComponent(destination.pathname);
    if (
      destination.origin !== "https://ethioexam.invalid" ||
      decodedPath.startsWith("//") ||
      decodedPath.includes("\\")
    ) {
      return "/dashboard";
    }
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/dashboard";
  }
}
