import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" flex justify-center flex-col items-center pb-20">
      <section className="h-[30vh] max-h-[] flex flex-col justify-center items-center ">
        <span className="text-4xl font-bold text-center">Empowering Businesses with Intelligent Scheduling.</span>
        <span>...for free!</span>
      </section>

      <section className="h-20">
        <Link href='/auth'>
          <Button className="bg-white text-black hover:bg-slate-300 hover:text-black">Use RosterPro</Button>
        </Link>
      </section>

      <video className="w-[90%] shadow-2xl shadow-slate-500 hover:cursor-pointer" loop autoPlay muted>
        <source src='/showcase.mov' type="video/mp4" />
      </video>
      
      
    </main>
  );
}
