import { NextRequest } from "next/server";
export default function queryParams<
  T extends Record<string, any> = Record<string, any>
>(searchParams: NextRequest["nextUrl"]["searchParams"]): T {
  const keys = searchParams.keys();
  let obj: any = {};
  for (const key of keys as any) {
    obj[key] = searchParams.get(key);
  }
  return obj as T;
}
