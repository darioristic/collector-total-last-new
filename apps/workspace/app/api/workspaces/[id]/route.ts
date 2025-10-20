import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: params.id },
      include: {
        modules: true,
        settings: true,
        users: true,
        logs: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, isActive } = body;

    const workspace = await prisma.workspace.update({
      where: { id: params.id },
      data: {
        name,
        description,
        isActive,
      },
      include: {
        modules: true,
        settings: true,
        users: true,
      },
    });

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Error updating workspace:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.workspace.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 }
    );
  }
}
