export const generateSlug = (titulo: string): string => {
    // Convertir a minúsculas
    let slug = titulo.toLowerCase();

    // Reemplazar caracteres especiales y acentos
    slug = slug.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[""'']/g, '')          // Eliminar comillas especiales
        .replace(/[&\/\\#,+()$~%.'":*?<>{}¿!¡]/g, '') // Eliminar caracteres especiales
        .replace(/[^a-z0-9\s-]/g, '')    // Solo permitir letras, números, espacios y guiones
        .trim()
        .replace(/\s+/g, '-')            // Reemplazar espacios con guiones
        .replace(/-+/g, '-');            // Evitar guiones múltiples

    // Obtener la fecha y hora actual
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +  // Mes (01-12)
        now.getDate().toString().padStart(2, '0') +         // Día (01-31)
        now.getHours().toString().padStart(2, '0') +        // Hora (00-23)
        now.getMinutes().toString().padStart(2, '0') +      // Minutos (00-59)
        now.getSeconds().toString().padStart(2, '0');       // Segundos (00-59)

    // Combinar el slug con el timestamp
    return `${slug}--${timestamp}`;
}; 