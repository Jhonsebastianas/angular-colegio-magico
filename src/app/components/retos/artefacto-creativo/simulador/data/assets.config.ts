import { DefPersonaje } from '../core/models';

/**
 * Rutas centralizadas de imágenes. Los archivos viven en la carpeta public/ del proyecto:
 *   public/personajes/*.jpg   public/escenario/*.jpeg   public/hechizos/<id>.webp (opcional)
 * Ninguna ruta se escribe en los componentes: todos llaman a este objeto.
 */
export const IMAGENES = {
  escenario: 'escenario/escenario-de-combate.jpeg',
  personajes: 'personajes/',
  hechizos: 'hechizos/',

  retrato(def: DefPersonaje, mk0 = false): string {
    const f = mk0 && def.imagen.mk0 ? def.imagen.mk0 : def.imagen.retrato;
    return f ? this.personajes + f : '';
  },
  hechizo(id: string): string {
    return `${this.hechizos}${id}.webp`;
  },
  /** Imagen alternativa cuando un archivo no existe o no carga. */
  placeholder:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3566"/><stop offset="1" stop-color="#0b0f24"/></linearGradient></defs><rect width="120" height="160" fill="url(#g)"/><circle cx="60" cy="58" r="22" fill="#4a5a9a"/><path d="M18 150c4-38 28-52 42-52s38 14 42 52z" fill="#4a5a9a"/></svg>`,
    ),
};
