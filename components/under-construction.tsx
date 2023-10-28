import Image from "next/image";

function UnderConstruction() {
  return (
    <div className="mt-4 md:mt-6 md:space-y-4 lg:mt-10">
      <h2 className="text-center text-2xl font-medium md:text-4xl">
        Under Construction
      </h2>
      <div className="relative mx-auto h-[300px] w-[300px] md:h-[500px] md:w-[500px]">
        <Image
          fill
          src="/under-construction.png"
          alt="Page under construction..."
          className="h-[800px] w-[800px] object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="text-center text-muted-foreground md:text-lg">
          If you would like to see it faster, contact me on Twitter -{" "}
          <a
            className="text-indigo-500 transition-all hover:underline"
            href="https://twitter.com/oldmannav"
            target="_blank"
          >
            @oldmannav
          </a>
        </p>
      </div>
    </div>
  );
}

export default UnderConstruction;
