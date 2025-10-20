import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const modules = await prisma.moduleRegistry.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, version, description, config, dependencies } = body;

    if (!name || !version) {
      return NextResponse.json(
        { error: "Module name and version are required" },
        { status: 400 }
      );
    }

    const module = await prisma.moduleRegistry.create({
      data: {
        name,
        version,
        description,
        config,
        dependencies,
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
