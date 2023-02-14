import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { CartService } from 'src/app/services/cart.service';
import { Cart, CartItem } from '../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cart!: Cart;

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart() {
    this.cartService.clearCart();
  }

  onRemoveFromCart(element: CartItem): void {
    this.cartService.removeFromCart(element);
  }

  onAddQuantity(element: CartItem): void {
    this.cartService.addToCart(element);
  }

  onRemoveQuantity(element: CartItem): void {
    this.cartService.removeQuantity(element);
  }

  onCheckout(): void {
    console.log('oncheckout')
    this.http.post('http://localhost:4242/checkout', {
      items: this.cart.items
    }).subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51MbV0WHuVocrPbB7ahTiajjzSfxlaOZ0pQSD7K3isfxcvs18xBlhn9YeOnF6oCiDaZyHXqpn6KQsjSSq7VGpDNpc00W6QaGfuW');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}
