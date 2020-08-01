import uniqid from "uniqid";

export const dataDispatcher = (payload, action) => {
  if (action.type === "set") {
    payload.mut[action.index][action.key] = action.new;
    if (
      payload.immut[action.index] &&
      action.new === payload.immut[action.index][action.key]
    ) {
      payload.changes = payload.changes.filter(
        (index) => index != action.index
      );
    } else {
      payload.changes.push(action.index);
    }
    payload.changes = [...new Set(payload.changes)];
    return payload;
  }

  if (action.type === "fetch") {
    payload.immut = action.data;
    payload.mut = action.data;
    payload.changes = [];
    return payload;
  }

  if (action.type === "append") {
    let object = {};
    action.columns.forEach((col) => {
      if (col.type === "number") {
        object[col.name] = 0;
      }
      if (col.type === "string") {
        object[col.name] = "abc";
      }
      if (col.type === "boolean") {
        object[col.name] = true;
      }
      if (col.type === "object") {
        object[col.name] = {};
      }
    });
    object.key = uniqid();
    payload.mut.push(object);
    payload.changes.push(payload.mut.length - 1);
    return payload;
  }
};
