import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import fetch from "node-fetch";

export async function POST(req: NextRequest) {
    const { url } = await req.json();
    if (!url) return new Response(JSON.stringify({ error: "No URL provided" }), { status: 400 });

    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const numPages = pdfDoc.getPageCount();
        return new Response(JSON.stringify({ numPages }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Failed to read PDF" }), { status: 500 });
    }
}