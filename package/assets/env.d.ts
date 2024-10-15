import type { TypedPocketbase } from "src/lib/pocketbase/schemas";

declare global {
  namespace App {
    interface Locals {
      pocketbase: TypedPocketbase;
    }
  }
}

export {};
