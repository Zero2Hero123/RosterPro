import GenerateDemo from "@/components/GenerateDemo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" flex justify-center flex-col items-center pb-20">
      <section className="h-[30vh] max-h-[] flex flex-col justify-center items-center">
        <span className="text-4xl font-bold text-center">Empowering Businesses with Intelligent Scheduling.</span>
        <span>...for free!</span>
      </section>

      <div className="my-4 flex flex-col items-center gap-2">
        <span className="text-3xl md:text-5xl">What is <span className="font-bold">RosterPro?</span></span>
        <div className="w-[50%] min-w-[400px] text-center px-4">
          <span className="font-bold">RosterPro</span>
          <span> is the new Workforce Management tool. It simplifies the process of creating, managing, and tracking employee schedules and tasks, making it easier for organizations to optimize staffing and improve operational efficiency. </span>
        </div>
      </div>
      <section className="h-20">
        <Link href='/auth'>
          <Button className="bg-white text-black hover:bg-slate-300 hover:text-black">Try RosterPro</Button>
        </Link>
      </section>

      <section className="flex flex-col lg:flex-row items-center justify-center gap-24">
        <video className="w-[50%] min-w-[370px] shadow-2xl shadow-slate-500 hover:cursor-pointer" loop autoPlay muted preload="none">
          <source src='/showcase.mp4' type="video/mp4" />
        </video>
        <GenerateDemo/>
      </section>
      
    </main>
  );
}
