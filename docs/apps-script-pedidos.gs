/**
 * Registro automático de pedidos de la tienda EliumNova en Google Sheets.
 *
 * Cómo instalarlo (una sola vez):
 * 1. Abrí la planilla de productos → Extensiones → Apps Script.
 * 2. Borrá lo que haya, pegá todo este archivo y guardá.
 * 3. Implementar → Nueva implementación → tipo "Aplicación web".
 *    Ejecutar como: Yo. Quién tiene acceso: Cualquier usuario.
 * 4. Autorizá los permisos y copiá la URL que termina en /exec.
 * 5. Pegala en ordersWebhookUrl dentro de lib/shop.ts y publicá el sitio.
 *
 * Cada pedido enviado desde la web agrega una fila por producto en la hoja "pedidos".
 * Con eso podés ver qué se pide, cuánto, desde qué localidad y cómo se entrega.
 * Los pedidos quedan como "Pendiente": cambiá el estado a "Vendido" cuando se concrete.
 */

const HOJA = "pedidos";
const COLUMNAS = [
  "fecha", "codigo", "estado", "nombre", "localidad", "entrega", "producto", "categoria",
  "marca", "cantidad", "precio", "subtotal", "total_pedido", "reserva", "dolar", "origen",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(HOJA);
    if (!sh) {
      sh = ss.insertSheet(HOJA);
      sh.appendRow(COLUMNAS);
      sh.setFrozenRows(1);
    }
    const fecha = new Date(data.fecha || Date.now());
    const rows = (data.items || []).map((it) => [
      fecha,
      data.codigo,
      "Pendiente",
      data.nombre || "",
      data.localidad || "",
      data.entrega || "",
      it.nombre,
      it.categoria,
      it.marca,
      it.cantidad,
      it.precio,
      it.precio != null ? it.precio * it.cantidad : "",
      data.total,
      data.reserva,
      data.dolar,
      data.origen,
    ]);
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, COLUMNAS.length).setValues(rows);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  } finally {
    lock.releaseLock();
  }
}
