import { NextRequest, NextResponse } from "next/server";
import { testAIConnection } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, model, apiKey, customBaseUrl, customModel } = body;

    const result = await testAIConnection({
      provider,
      model,
      apiKey,
      customBaseUrl,
      customModel,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        provider: "AI Engine",
        model: "",
        models: [],
        message: `Erreur interne lors du test : ${error.message || error}`,
        isMockMode: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
