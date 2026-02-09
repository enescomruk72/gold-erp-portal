/**
 * Next.js API Proxy Route
 * Client -> Next.js Server -> External Backend
 * Session token otomatik eklenir (Authorization: Bearer <accessToken>)
 *
 * Kullanım: /api/proxy/v1/iam/me, /api/proxy/b2b/orders, vb.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { env } from "@/config/env";
import type { Session } from "next-auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxy(request, resolvedParams, "GET");
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxy(request, resolvedParams, "POST");
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxy(request, resolvedParams, "PUT");
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxy(request, resolvedParams, "PATCH");
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return handleProxy(request, resolvedParams, "DELETE");
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

async function handleProxy(
    request: NextRequest,
    params: { path: string[] },
    method: string
) {
    try {
        const pathSegments = params.path;
        const path =
            pathSegments[0] === "v1"
                ? `/${pathSegments.join("/")}`
                : `/v1/${pathSegments.join("/")}`;

        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        const baseUrl = env.nextPublicApiUrl.replace("/v1", "");
        const url = `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;

        const session = await auth();
        const accessToken = (session as Session)?.accessToken;

        const contentType = request.headers.get("content-type");
        let body: string | FormData | undefined;

        if (method !== "GET" && method !== "HEAD") {
            if (
                contentType?.includes("multipart/form-data") ||
                contentType?.includes("application/x-www-form-urlencoded")
            ) {
                body = await request.formData();
            } else if (contentType?.includes("application/json")) {
                body = await request.text();
            } else {
                body = await request.text();
            }
        }

        const headers: HeadersInit = {};
        if (!(body instanceof FormData)) {
            headers["Content-Type"] = contentType || "application/json";
        }
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        ["x-request-id", "x-forwarded-for", "user-agent"].forEach(
            (headerName) => {
                const value = request.headers.get(headerName);
                if (value) {
                    headers[headerName] = value;
                }
            }
        );

        const response = await fetch(url, { method, headers, body });
        const responseText = await response.text();

        const responseHeaders: HeadersInit = {
            "Content-Type":
                response.headers.get("content-type") || "application/json",
        };
        if (env.isDevelopment) {
            responseHeaders["Access-Control-Allow-Origin"] = "*";
            responseHeaders["Access-Control-Allow-Methods"] =
                "GET, POST, PUT, PATCH, DELETE, OPTIONS";
            responseHeaders["Access-Control-Allow-Headers"] =
                "Content-Type, Authorization";
        }

        return new NextResponse(responseText, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("[Proxy] Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Proxy hatası",
                data: { error: (error as Error).message },
                statusCode: 500,
                type: "PROXY_ERROR",
                timestamp: new Date().toISOString(),
                requestId: "",
            },
            { status: 500 }
        );
    }
}
