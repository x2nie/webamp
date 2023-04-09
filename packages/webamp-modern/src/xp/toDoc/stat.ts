export const foobar ='FOOBAR';

/**
 * main clas for doc cemo
 */
export class Statistics {
    /**
     * Returns the average of two numbers.
     *
     * @remarks
     * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
     *
     * @param x - The first input number
     * @param y - The second input number
     * @returns The arithmetic mean of `x` and `y`
     *
     * @beta
     */
    public static getAverage(x: number, y: number): number {
      return (x + y) / 2.0;
    }
  
    public static secondAverage(x: number, y: number): number {
      return (x + y) / 2.0;
    }
  
    /** new docum */
    public static secondAverage2(x: number, y: number): number {
      return (x + y) / 2.0;
    }
  
  
  }