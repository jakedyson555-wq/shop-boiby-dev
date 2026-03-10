interface SecTitleProps {
    bold:  string;
    light: string;
  }
  
  /** Section heading: bold keyword + lighter descriptive phrase. */
  export function SecTitle({ bold, light }: SecTitleProps) {
    return (
      <h2 className="text-2xl font-semibold text-t1 mb-6 tracking-[-0.01em] leading-[1.2]">
        {bold}{" "}
        <span className="text-t2 font-semibold">{light}</span>
      </h2>
    );
  }