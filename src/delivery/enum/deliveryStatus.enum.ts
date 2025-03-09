export enum DeliveryStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  OUT_FOR_PICKUP = 'out_for_pickup',
  PICKED_UP = 'pick_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED_DELIVERY = 'failed_delivery',
  RETURNED_TO_SENDER = 'returned_to_sender',
  CANCELLED = 'cancelled',
}
