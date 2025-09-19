import { readFile, writeFile } from "fs/promises";

async function convertSongs() {
  try {
    // Leer archivo original
    const data = await readFile("./public/songs.json", "utf-8");
    const json = JSON.parse(data);

    // Transformar canciones
    const transformed = {
      canciones: json.canciones.map((cancion) => {
        const { artist, ...rest } = cancion;
        return {
          ...rest,
          artists: artist ? [artist] : [],
        };
      }),
    };

    // Guardar en songs4.json
    await writeFile(
      "./public/songs4.json",
      JSON.stringify(transformed, null, 2),
      "utf-8"
    );

    console.log("✅ Archivo convertido y guardado en ./public/songs4.json");
  } catch (error) {
    console.error("❌ Error procesando el archivo:", error);
  }
}

convertSongs();
