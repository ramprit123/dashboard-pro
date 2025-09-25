import { NextRequest, NextResponse } from 'next/server';
import { sampleCartData, getCartAnalytics } from '@/lib/cart-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAnalytics = searchParams.get('analytics') === 'true';

    const response = {
      carts: sampleCartData,
      ...(includeAnalytics && { analytics: getCartAnalytics() }),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Cart data API error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, cartId, itemData } = await request.json();

    // Mock cart operations - in production, this would update your database
    switch (action) {
      case 'add_item':
        return NextResponse.json({
          success: true,
          message: 'Item added to cart',
          cartId: cartId || `cart_${Date.now()}`,
        });

      case 'remove_item':
        return NextResponse.json({
          success: true,
          message: 'Item removed from cart',
        });

      case 'update_quantity':
        return NextResponse.json({
          success: true,
          message: 'Quantity updated',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cart operation error:', error);
    return NextResponse.json({ error: 'Cart operation failed' }, { status: 500 });
  }
}
