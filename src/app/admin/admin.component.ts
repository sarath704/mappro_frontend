import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {MdDialog, MdSnackBar} from '@angular/material';

import {UserService, ColorMarkerService, GoogleMapsService, OrderService} from "app/common/services";
import {ColorMarkerComponent} from "../color-marker/color-marker.component";



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  entryComponents: [ColorMarkerComponent],
})
export class AdminComponent implements OnInit {

  @ViewChild('map') map: any;

  public form: FormGroup;
  public submitted: boolean = false;
  public showNewOrderForm: boolean = false;
  public colors: Array<IColorMarker>;
  public orders: Array<IOrder> = [];
  public currentPlace: ICoordinates;

  users: Array<IUser>;
  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private userService: UserService, private formBuilder: FormBuilder,
              private dialog: MdDialog, private colorMarkerService: ColorMarkerService,
              private googleMapsService: GoogleMapsService, private orderService: OrderService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.getUsers();
    this.getColors();
    this.getOrders();
  }

  private getUsers(): void {
    this.userService.all()
      .subscribe(
        (users: Array<IUser>) => this.users = users,
        (err: any) => console.log(err)
      );
  }

  private getColors(): void {
    this.colorMarkerService.all().subscribe((res: Array<IColorMarker>) => this.colors = res);
  }

  public getOrders(): void {
    this.orderService.getAll()
      .switchMap(res => res)
      .map((order: IOrder) => {
        order.isVisible = false;
        const removeTrailingZeros = (time: string) => time.split(':').slice(0, 2).join(':');
        console.log(order.timeFrom)
        order.timeTo = removeTrailingZeros(order.timeTo);
        console.log(order.timeFrom)
        order.timeFrom = removeTrailingZeros(order.timeFrom);
        return order;
      })
      .do(console.log)
      .subscribe((order: IOrder) => this.orders.push(order));
  }

  openNewColorDialog(): void {
    const dialog = this.dialog.open(ColorMarkerComponent);
  }

  moveMarker(event: {coords: ICoordinates}): void {
    this.currentPlace = event.coords;
  }

  changeOrderVisibility(id: number): void {
    for (const order of this.orders) {
      if (order.isVisible && order.id !== id) {
        order.isVisible = false;
      }
    }
  }

}