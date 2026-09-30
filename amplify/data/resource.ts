import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { validateCoupon } from "./validate-coupon/resource";
import { placeOrder } from "./place-order/resource";
import { getCatalog } from "./get-catalog/resource";
import { syncSuppliers } from "./sync-suppliers/resource";

// Datos del negocio.
// - Solo el grupo ADMIN lee y edita productos (con costos), pedidos, códigos y proveedores.
// - Los visitantes solo acceden por funciones: ver el catálogo con precios finales,
//   validar un código y registrar su pedido. Nunca ven costos ni márgenes.
const schema = a
  .schema({
    OrderStatus: a.enum(["PENDIENTE", "CONFIRMADO", "VENDIDO", "CANCELADO"]),

    Product: a
      .model({
        slug: a.string().required(),
        nombre: a.string().required(),
        categoria: a.string().required(), // celulares | accesorios | audio | mac
        marca: a.string(),
        estado: a.string(), // Nuevo | Sellado | Reacondicionado
        costo: a.float(),
        moneda: a.string(), // USD | ARS
        precio: a.float(), // precio fijo en pesos (pisa la regla de margen)
        consultar: a.boolean(),
        detalle: a.string(),
        compat: a.string(),
        plazo: a.string(),
        garantia: a.string(),
        nota: a.string(),
        foto: a.string(),
        destacado: a.boolean(),
        activo: a.boolean(),
        orden: a.integer(),
        proveedor: a.string(),
        codigoProveedor: a.string(), // código o texto exacto con el que figura en la planilla del proveedor
        costoActualizado: a.datetime(),
      })
      .identifier(["slug"])
      .authorization((allow) => [allow.group("ADMIN")]),

    SupplierSource: a
      .model({
        nombre: a.string().required(),
        csvUrl: a.string().required(), // planilla publicada como CSV
        columnaCodigo: a.string().required(),
        columnaCosto: a.string().required(),
        moneda: a.string(), // USD | ARS
        activo: a.boolean(),
        ultimaSync: a.datetime(),
        ultimoResultado: a.string(),
      })
      .authorization((allow) => [allow.group("ADMIN")]),

    Order: a
      .model({
        codigo: a.string().required(),
        estado: a.ref("OrderStatus"),
        nombre: a.string(),
        telefono: a.string(),
        email: a.string(),
        localidad: a.string(),
        entrega: a.string(),
        direccion: a.string(),
        pago: a.string(),
        items: a.json(),
        subtotal: a.float(),
        descuento: a.float(),
        total: a.float(),
        reserva: a.float(),
        codigoDescuento: a.string(),
        dolar: a.float(),
        origen: a.string(),
        nota: a.string(),
        verificado: a.boolean(),
      })
      .authorization((allow) => [allow.group("ADMIN")]),

    Coupon: a
      .model({
        codigo: a.string().required(),
        pct: a.float().required(),
        descripcion: a.string(),
        desde: a.date(),
        hasta: a.date(),
        categorias: a.string().array(),
        activo: a.boolean(),
        usos: a.integer(),
      })
      .identifier(["codigo"])
      .authorization((allow) => [allow.group("ADMIN")]),

    // Ajustes internos del sistema (por ejemplo, la marca de carga inicial).
    Setting: a
      .model({
        clave: a.string().required(),
        valor: a.string(),
      })
      .identifier(["clave"])
      .authorization((allow) => [allow.group("ADMIN")]),

    CouponResult: a.customType({
      valido: a.boolean().required(),
      codigo: a.string(),
      pct: a.float(),
      descripcion: a.string(),
      categorias: a.string().array(),
      mensaje: a.string(),
    }),

    PlaceOrderResult: a.customType({
      ok: a.boolean().required(),
      codigo: a.string(),
      mensaje: a.string(),
    }),

    CatalogResult: a.customType({
      productos: a.json().required(), // lista pública, con precio final en pesos
      dolar: a.float().required(),
      dolarEnVivo: a.boolean(),
      actualizado: a.string(),
    }),

    SyncResult: a.customType({
      ok: a.boolean().required(),
      resumen: a.string(),
    }),

    getCatalog: a
      .query()
      .returns(a.ref("CatalogResult"))
      .authorization((allow) => [allow.guest(), allow.authenticated()])
      .handler(a.handler.function(getCatalog)),

    validateCoupon: a
      .query()
      .arguments({ codigo: a.string().required() })
      .returns(a.ref("CouponResult"))
      .authorization((allow) => [allow.guest(), allow.authenticated()])
      .handler(a.handler.function(validateCoupon)),

    placeOrder: a
      .mutation()
      .arguments({ pedido: a.json().required() })
      .returns(a.ref("PlaceOrderResult"))
      .authorization((allow) => [allow.guest(), allow.authenticated()])
      .handler(a.handler.function(placeOrder)),

    syncSuppliersNow: a
      .mutation()
      .returns(a.ref("SyncResult"))
      .authorization((allow) => [allow.group("ADMIN")])
      .handler(a.handler.function(syncSuppliers)),
  })
  .authorization((allow) => [
    allow.resource(validateCoupon),
    allow.resource(placeOrder),
    allow.resource(getCatalog),
    allow.resource(syncSuppliers),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: "userPool" },
});
