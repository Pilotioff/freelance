import { Injectable } from '@nestjs/common';

export type Moneda = 'COP' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface TasasCambio {
  USD: number;
  EUR: number;
  GBP: number;
  JPY: number;
}

export interface ConvertirDivisaDto {
  valor: number;
  monedaOrigen: Moneda;
  monedaDestino: Moneda;
}

export interface ResultadoConversion {
  valor: number;
  monedaOrigen: Moneda;
  monedaDestino: Moneda;
  resultado: number;
  tasa: number;
}

@Injectable()
export class DivisasService {
  private readonly tasas: TasasCambio = {
    USD: 0.00025,
    EUR: 0.00023,
    GBP: 0.00020,
    JPY: 0.037,
  };

  obtenerTasas(): TasasCambio {
    return { ...this.tasas };
  }

  convertir(dto: ConvertirDivisaDto): ResultadoConversion {
    const valorEnCop = this.aCop(dto.valor, dto.monedaOrigen);
    const resultado = this.desdeCop(valorEnCop, dto.monedaDestino);
    const tasa = this.obtenerTasa(dto.monedaOrigen, dto.monedaDestino);

    return {
      valor: dto.valor,
      monedaOrigen: dto.monedaOrigen,
      monedaDestino: dto.monedaDestino,
      resultado: Math.round(resultado * 100) / 100,
      tasa,
    };
  }

  private aCop(valor: number, moneda: Moneda): number {
    if (moneda === 'COP') return valor;
    const tasa = this.tasas[moneda];
    return valor / tasa;
  }

  private desdeCop(valorCop: number, moneda: Moneda): number {
    if (moneda === 'COP') return valorCop;
    const tasa = this.tasas[moneda];
    return valorCop * tasa;
  }

  private obtenerTasa(origen: Moneda, destino: Moneda): number {
    if (origen === destino) return 1;
    const enCop = this.aCop(1, origen);
    return this.desdeCop(enCop, destino);
  }
}
