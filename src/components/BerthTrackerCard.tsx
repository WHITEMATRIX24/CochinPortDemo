import Image from 'next/image';

type CardProps = {
  imageSrc: string;
  berthId: string;
  berthNumber: string;
  countryFlag: string;
};

export default function Card({ imageSrc, berthId, berthNumber, countryFlag }: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm p-4 text-center hover:shadow-md transition duration-200">
      <div className="flex items-center justify-between mt-2 mb-2">
        {/* Flag on Left */}
        <div className="relative w-10 aspect-[3/2]">
          <Image
            src={countryFlag}
            alt={`Flag for ${berthId}`}
            fill
            className="rounded object-cover"
          />
        </div>
        {/* Berth Number on Right */}
        <p className="font-bold text-black text-sm m-0">Berth No: {berthNumber}</p>
      </div>

      {/* Image Wrapper */}
      <div className="relative w-full h-42 mb-3">
        <Image
          src={imageSrc}
          alt={berthId}
          fill
          className="rounded object-cover"
        />
      </div>

      {/* Berth ID */}
      <p className="font-medium text-gray-800 truncate">{berthId}</p>

    </div>
  );
}
