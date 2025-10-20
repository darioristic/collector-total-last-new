import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const modules = await prisma.workspaceModule.findMany({
      where: { workspaceId: id },
      orderBy: {
        moduleName: "asc",
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching workspace modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace modules" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { moduleName, isEnabled, config } = body;

    if (!moduleName) {
      return NextResponse.json(
        { error: "Module name is required" },
        { status: 400 }
      );
    }

    const workspaceModule = await prisma.workspaceModule.upsert({
      where: {
        workspaceId_moduleName: {
          workspaceId: id,
          moduleName,
        },
      },
      update: {
        isEnabled,
        config,
      },
      create: {
        workspaceId: id,
        moduleName,
        isEnabled,
        config,
      },
    });

    return NextResponse.json(workspaceModule, { status: 201 });
  } catch (error) {
    console.error("Error managing workspace module:", error);
    return NextResponse.json(
      { error: "Failed to manage workspace module" },
      { status: 500 }
    );
  }
}
