"use client";

import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { useRef, useState } from "react";

import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { fetchClient } from "@/lib/fetchClient";

type ComponentProps = {
  data?: unknown;
  exportMode?: boolean;
};

const Component1 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-blue-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-100"}
      `}
    >
      Component 1
    </div>
  );
};

const Component2 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-red-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-140"}
      `}
    >
      Component 2
    </div>
  );
};

const Component3 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-amber-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-250"}
      `}
    >
      Component 3
    </div>
  );
};

const Component4 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-lime-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-90"}
      `}
    >
      Component 4
    </div>
  );
};

const Component5 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-teal-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-100"}
      `}
    >
      Component 5
    </div>
  );
};

const Component6 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-yellow-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-100"}
      `}
    >
      Component 6
    </div>
  );
};

const Component7 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-pink-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-100"}
      `}
    >
      Component 7
    </div>
  );
};

const Component8 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-rose-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-100"}
      `}
    >
      Component 8
    </div>
  );
};

const Component9 = ({ exportMode }: ComponentProps) => {
  return (
    <div
      className={`
        rounded-md px-4 py-3 bg-indigo-700/50 h-40
        ${exportMode ? "w-full max-w-full" : "w-full min-w-80 max-w-100"}
      `}
    >
      Component 9
    </div>
  );
};

const AdministrationTest = () => {
  const exportRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["test"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/social"),
  });
  
  console.log('[DEV]', data);

  const [isSelecting, setSelecting] = useState(false);

  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([
    "component1",
    "component2",
  ]);

  const EXPORTABLE_COMPONENTS = {
    component1: {
      title: "Component 1",
      component: Component1,
      props: {
        data,
      },
    },

    component2: {
      title: "Component 2",
      component: Component2,
      props: {
        data,
      },
    },

    component3: {
      title: "Component 3",
      component: Component3,
      props: {
        data,
      },
    },

    component4: {
      title: "Component 4",
      component: Component4,
      props: {
        data,
      },
    },

    component5: {
      title: "Component 5",
      component: Component5,
      props: {
        data,
      },
    },

    component6: {
      title: "Component 6",
      component: Component6,
      props: {
        data,
      },
    },

    component7: {
      title: "Component 7",
      component: Component7,
      props: {
        data,
      },
    },

    component8: {
      title: "Component 8",
      component: Component8,
      props: {
        data,
      },
    },

    component9: {
      title: "Component 9",
      component: Component9,
      props: {
        data,
      },
    },
  };

  const toggleBlock = (key: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key],
    );
  };

  const exportPNG = async () => {
    if (!exportRef.current) return;

    const dataUrl = await toPng(exportRef.current, {
      pixelRatio: 2,
    });

    const link = document.createElement("a");

    link.download = "dashboard-export.png";
    link.href = dataUrl;

    link.click();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Typography.H2>Testings</Typography.H2>

        <Button onClick={() => setSelecting((prev) => !prev)}>
          Export page
        </Button>
      </div>

      {isSelecting && (
        <div className="mb-6 rounded-md border p-4">
          <div className="mb-4 flex flex-wrap gap-4">
            {Object.entries(EXPORTABLE_COMPONENTS).map(
              ([key, config]) => (
                <label
                  key={key}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedBlocks.includes(key)}
                    onChange={() => toggleBlock(key)}
                  />

                  {config.title}
                </label>
              ),
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={exportPNG}>
              Export PNG
            </Button>
          </div>
        </div>
      )}

      {/* Обычная страница */}
      <div className="flex flex-wrap items-center gap-4">
        <Component1 data={data} />
        <Component2 data={data} />
        <Component3 data={data} />
        <Component4 data={data} />
        <Component5 data={data} />
        <Component6 data={data} />
        <Component7 data={data} />
        <Component8 data={data} />
        <Component9 data={data} />
      </div>

      {/* Скрытый export layout */}
      <div className="fixed left-[-999999px] top-0">
        <div
          ref={exportRef}
          className="flex w-[1200px] flex-col gap-4 bg-white p-6"
        >
          {selectedBlocks.map((key) => {
            const config =
              EXPORTABLE_COMPONENTS[
                key as keyof typeof EXPORTABLE_COMPONENTS
              ];

            const Component = config.component;

            return (
              <Component
                key={key}
                exportMode
                {...config.props}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdministrationTest;