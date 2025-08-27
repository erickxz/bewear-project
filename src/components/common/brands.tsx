import Image from "next/image";

const Brands = () => {
  return ( 
    <div className="space-y-3">
      <h3 className="font-semibold px-5">Marcas Parceiras</h3>
      <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        
        {/* Nike */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-white border rounded-2xl h-[80px] w-[80px]">
            <Image src="/nike.svg" alt="Nike" width={35} height={35} className="object-contain" />
          </div>
          <span className="text-xs font-medium mt-2">Nike</span>
        </div>

        {/* Adidas */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-white border rounded-2xl h-[80px] w-[80px]">
            <Image src="/simple-icons_adidas.svg" alt="Adidas" width={30} height={30} className="object-contain" />
          </div>
          <span className="text-xs font-medium mt-2">Adidas</span>
        </div>

        {/* Puma */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-white border rounded-2xl h-[80px] w-[80px]">
            <Image src="/simple-icons_puma.png" alt="Puma" width={30} height={30} className="object-contain" />
          </div>
          <span className="text-xs font-medium mt-2">Puma</span>
        </div>

        {/* Polo Ralph Lauren */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-white border rounded-2xl h-[80px] w-[80px]">
            <Image src="/Polo Ralph Lauren Black 1.svg" alt="Polo Ralph Lauren" width={20} height={20} className="object-contain" />
          </div>
          <span className="text-xs font-medium mt-2 text-center">Polo</span>
        </div>

        {/* Zara */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-white border rounded-2xl h-[80px] w-[80px]">
            <Image src="/Zara_Logo 1.svg" alt="Zara" width={40} height={40} className="object-contain" />
          </div>
          <span className="text-xs font-medium mt-2">Zara</span>
        </div>

      </div>
    </div>
  );
}
 
export default Brands;
