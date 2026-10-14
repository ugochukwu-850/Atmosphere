import Image from "next/image";

/** Cover photo. The API serves one photo per listing for now. */
export function Gallery({ photoUrl, title }: { photoUrl?: string; title: string }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted md:aspect-[21/9]">
      {photoUrl && <Image src={photoUrl} alt={title} fill priority sizes="100vw" className="object-cover" />}
    </div>
  );
}
