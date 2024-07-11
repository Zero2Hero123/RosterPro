import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" flex justify-center flex-col items-center">
      <section className="h-[40vh] max-h-[] flex items-center ">
        <span className="text-5xl font-bold text-center">Empowering Businesses with Intelligent Scheduling.</span>
      </section>
      <Link href='/dashboard/scheduler'>Click here</Link>
    </main>
  );
}
