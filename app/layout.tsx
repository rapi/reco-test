"use client";
import { Navbar } from "@/src/components/Navbar/Navbar";
import { ReactNode } from "react";
import { Grid } from "@mui/system";
import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Grid container spacing={0}>
          <Grid size={1.5}>
            <Navbar />
          </Grid>
          <Grid size={10.5}>{children}</Grid>
        </Grid>
      </body>
    </html>
  );
}
