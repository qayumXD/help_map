import type { Dict } from './en'

const ja: Dict = {
  'app.tagline': '近くの無料の食べ物・宿所・医療・支援',
  'header.privacy': 'プライバシー',

  'search.placeholder': '都市名や住所を入力…',
  'search.submit': '検索',
  'search.locate': '現在地を使う',
  'search.locating': '取得中…',
  'search.within': '検索範囲',
  'search.clear': '検索を消す',

  'cat.food': '食事・食材配布',
  'cat.shelter': '宿泊支援',
  'cat.health': '医療',
  'cat.hygiene': '衛生設備',
  'cat.water': '飲み水',
  'cat.community': 'コミュニティ施設・Wi-Fi',

  'chips.label': 'カテゴリで絞り込む',
  'chips.openNow': '営業中のみ',
  'chips.shown': '{total} 件表示中',

  'layers.live': 'ライブ',
  'layers.alerts': '気象警報',
  'layers.quakes': '地震',
  'layers.imagery': '衛星画像',
  'layers.eonet': '世界の災害',
  'event.details': '詳細を見る',
  'layers.loading': '読み込み中…',
  'layers.refresh': '{label}を更新',

  'common.dismiss': '閉じる',
  'a11y.skip': '結果へスキップ',

  'info.offline': 'オフラインです。前回保存した結果を表示しています。',
  'info.restored': '前回の検索結果を復元しました。最新データは再検索してください。',
  'warn.text':
    '{n} 件の施設が災害等の影響を受けている可能性があります。カードの警告マークをご確認ください。',

  'idle.title': 'あなたの街の無料サポートを見つけよう',
  'idle.body':
    '食料配布、宿泊先、診療所、シャワー、飲み水、コミュニティスペースをひとつの地図で。位置情報は端末から離れません。',
  'idle.cta': '現在地を使う',
  'idle.hint': '上の検索ボックスから地名でも探せます。',

  'results.searching': '{place} の周辺を検索中…',
  'results.noneTitle': '周辺で見つかりませんでした',
  'results.noneBody': '検索半径を広げるか、フィルターを解除してみてください。',
  'results.count': '{place} の近くにある施設: {n} 件',
  'results.closest': '近い順',
  'results.placeFallback': 'あなた',

  'coverage.body': '掲載内容は OpenStreetMap の貢献者に依存し、地域によって差があります',
  'coverage.bodyFood': '。特に無料の食事支援は、この地域ではまだ少ないです',
  'coverage.link': 'OpenStreetMapで情報を追加',
  'coverage.suffix': '。追加された場所は数分後にここに表示されます。',

  'card.minWalk': '徒歩 {m} 分',
  'card.affected': '影響を受ける可能性:',
  'card.report': '問題を報告',
  'card.open': '営業中',
  'card.closed': '営業時間外',

  'mode.toggle': '見やすい表示を切り替える',

  'onboard.title': 'HelpMap へようこそ',
  'onboard.p1':
    '近くの無料の食事・宿泊・医療・生活支援施設を探せます。完全無料、アカウント登録も不要です。',
  'onboard.p2':
    '位置情報は端末の外に出ません。データは OpenStreetMap と公共の防災フィードから提供されています。',
  'onboard.cta': 'はじめる',

  'detail.address': '住所',
  'detail.hours': '営業時間',
  'detail.phone': '電話',
  'detail.web': 'ウェブ',
  'detail.directions': '経路案内',
  'detail.showMap': '地図で表示',

  'map.placeholder': '検索または現在地の共有で地図が表示されます。',
  'quake.details': 'USGSで詳細を見る',

  'privacy.title': 'プライバシー',
  'privacy.collect.title': '収集する情報',
  'privacy.collect.body':
    'HelpMap にはアカウントも分析ツールもCookieもありません。当サイトにサーバーは存在せず、個人データを収集・保存することはありません。静的なウェブサイトです。',
  'privacy.location.title': '位置情報について',
  'privacy.location.body':
    '「現在地を使う」をタップすると、ブラウザーが端末上で座標をアプリへ渡します。その座標は端末内にとどまり、距離計算にのみ使われます。',
  'privacy.location.third': '第三者に送信されるもの',
  'privacy.location.thirdBody':
    '地名を検索すると、そのテキストが OpenStreetMap の Nominatim ジオコーディングサービスへ送られます。リソース一覧(Overpass API)や防災フィード(気象庁・USGS)への要求には、約1km精度に丸めた座標が含まれます。',
  'privacy.storage.title': '端末内のみに保存されるもの',
  'privacy.storage.body':
    '最後の検索と結果、キャッシュされた地図タイル、最近のジオコーディング回答は、オフライン動作のためブラウザーのローカルストレージに保存されます。キー: hm:search、hm:resources、hm:quakes、hm:alerts、hm:cache:*。ブラウザーデータの削除ですべて消えます。',
  'privacy.sources.title': 'データソースとライセンス',
  'privacy.sources.body':
    '地図データ © OpenStreetMap コントリビューター (ODbL)。気象警報は NOAA/NWS、地震データは USGS。有効な場合、衛星画像は NASA EOSDIS GIBS。',
  'privacy.contact': 'ご質問などは GitHub でIssueを開いてください。',
}

export default ja
