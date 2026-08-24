import type { Dict } from './en'

const es: Dict = {
  'app.tagline': 'Comida, refugio, salud y apoyo gratuitos cerca de ti',
  'header.privacy': 'Privacidad',

  'search.placeholder': 'Ingresa una ciudad o dirección…',
  'search.submit': 'Buscar',
  'search.locate': 'Usar mi ubicación',
  'search.locating': 'Ubicando…',
  'search.within': 'Dentro de',
  'search.clear': 'Borrar búsqueda',

  'cat.food': 'Alimentos y comidas',
  'cat.shelter': 'Refugio',
  'cat.health': 'Salud',
  'cat.hygiene': 'Higiene',
  'cat.water': 'Agua',
  'cat.community': 'Comunidad y Wi-Fi',

  'chips.label': 'Filtrar por categoría',
  'chips.shown': '{total} mostrados',

  'layers.live': 'En vivo',
  'layers.alerts': 'Alertas meteorológicas',
  'layers.quakes': 'Terremotos',
  'layers.loading': 'cargando…',
  'layers.refresh': 'Actualizar {label}',

  'common.dismiss': 'Cerrar',

  'info.offline': 'Sin conexión — mostrando tus últimos resultados guardados.',
  'info.restored': 'Se restauró tu última búsqueda. Busca de nuevo para datos frescos.',
  'warn.text':
    '{n} lugares podrían estar afectados por peligros activos — mira las alertas en sus tarjetas.',

  'idle.title': 'Encuentra ayuda gratuita cerca de ti',
  'idle.body':
    'Bancos de alimentos, refugios, clínicas, duchas, agua potable y espacios comunitarios — todo en un solo mapa. Tu ubicación nunca sale de tu dispositivo.',
  'idle.cta': 'Usar mi ubicación',
  'idle.hint': '…o busca una ciudad arriba.',

  'results.searching': 'Buscando cerca de {place}…',
  'results.noneTitle': 'Sin resultados aquí',
  'results.noneBody': 'Prueba ampliar el radio o reactivar los filtros.',
  'results.count': '{n} lugares cerca de {place}',
  'results.closest': 'más cercanos primero',
  'results.placeFallback': 'ti',

  'coverage.body':
    'La cobertura depende de los colaboradores de OpenStreetMap y varía según la región',
  'coverage.bodyFood':
    ' — los servicios gratuitos de comida están especialmente poco mapeados aquí',
  'coverage.link': 'Agregarlo en OpenStreetMap',
  'coverage.suffix': '. ¿Falta un lugar? Agrégalo y aparecerá aquí en minutos.',

  'card.minWalk': '{m} min a pie',
  'card.affected': 'Podría estar afectado:',
  'card.report': 'Informar de un problema',

  'detail.address': 'Dirección',
  'detail.hours': 'Horario',
  'detail.phone': 'Teléfono',
  'detail.web': 'Web',
  'detail.directions': 'Cómo llegar',
  'detail.showMap': 'Mostrar en el mapa',

  'map.placeholder': 'Busca o comparte tu ubicación para ver el mapa.',
  'quake.details': 'Detalles en USGS',

  'privacy.title': 'Privacidad',
  'privacy.collect.title': 'Lo que recopilamos',
  'privacy.collect.body':
    'HelpMap no tiene cuentas, análisis ni cookies. No recopilamos ni almacenamos datos personales en servidores — no existen servidores de HelpMap. La aplicación es un sitio web estático.',
  'privacy.location.title': 'Tu ubicación',
  'privacy.location.body':
    'Si tocas "Usar mi ubicación", tu navegador proporciona coordenadas a la app en tu dispositivo. Esas coordenadas permanecen en tu navegador y solo se usan para calcular distancias localmente.',
  'privacy.location.third': 'Enviado a terceros',
  'privacy.location.thirdBody':
    'Cuando buscas un lugar, el texto se envía al servicio de geocodificación Nominatim de OpenStreetMap. Las solicitudes de listados (Overpass API) y fuentes de peligros (weather.gov, USGS) incluyen coordenadas redondeadas (~1 km de precisión).',
  'privacy.storage.title': 'Guardado solo en tu dispositivo',
  'privacy.storage.body':
    'Tu última búsqueda y resultados, tiles de mapa en caché y respuestas recientes de geocodificación se guardan en el almacenamiento local de tu navegador para que la app funcione sin conexión. Claves: hm:search, hm:resources, hm:quakes, hm:alerts, hm:cache:*. Borrar los datos del navegador elimina todo.',
  'privacy.sources.title': 'Fuentes de datos y licencias',
  'privacy.sources.body':
    'Datos del mapa © colaboradores de OpenStreetMap (ODbL). Alertas meteorológicas vía NOAA/NWS. Datos sísmicos vía USGS. Imágenes satelitales vía NASA EOSDIS GIBS cuando están activadas.',
  'privacy.contact': '¿Preguntas? Abre un issue en GitHub.',
}

export default es
