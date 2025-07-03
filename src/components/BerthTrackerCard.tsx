import Image from 'next/image';

type CardProps = {
  imageSrc: string;
  berthId: string;
};

export default function Card({ imageSrc, berthId }: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm p-4 text-center hover:shadow-md transition duration-200">
      {/* 👇 Relative wrapper with fixed height */}
      <div className="relative w-full h-42 mb-3">
        <Image
          src={imageSrc}
          alt={berthId}
          fill
          className="rounded object-cover"
        />
      </div>
      <p className="font-medium text-gray-800 truncate">{berthId}</p>
    </div>
  );
}
