/// <reference types="vite/client" />

declare module "*.json" {
  const value: any; // You can make this more specific if you know the exact JSON structure
  export default value;
}
