/**
 * WidgetPosition Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class WidgetPosition {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number
    ) {
        if (x < 0 || y < 0) {
            throw new Error('Position coordinates cannot be negative');
        }
        if (width <= 0 || height <= 0) {
            throw new Error('Dimensions must be positive');
        }
    }

    public static create(x: number, y: number, width: number, height: number): WidgetPosition {
        return new WidgetPosition(x, y, width, height);
    }

    public equals(other: WidgetPosition): boolean {
        return (
            this.x === other.x &&
            this.y === other.y &&
            this.width === other.width &&
            this.height === other.height
        );
    }
}
