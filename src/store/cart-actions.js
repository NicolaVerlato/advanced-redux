import { uiActions } from "./ui-slice"
import { cartActions } from "./cart-slice"

export const fetchCartData = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch('https://advanced-redux-fbcea-default-rtdb.firebaseio.com/cart.json')
            if(!response.ok){
                throw new Error('Could not fetch cart data');
            }
            
            const data = await response.json()
            
            return data;
        }
        
        try {
            const cartData = await fetchData();
            
            dispatch(cartActions.replaceCart({
                items: cartData.items || [],
                totalQuantity: cartData.totalQuantity,
              }
            ))
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error',
                message: 'Fetching cart data failed'
            }))
        }
    };

} 

export const sendCartData = (cart) => {
    // ogni volta che il carrello cambia si inviano i nuovi dati al server
    // il metodo put serve a sovrascrivere i dati vecchi con quelli nuovi senza che si creino doppioni nel db
    return async (dispatch) => {
      dispatch(
        uiActions.showNotification({
          status: 'pending',
          title: 'Sending...',
          message: 'Sending cart data!',
        })
      );
  
      const sendRequest = async () => {
        const response = await fetch(
          'https://advanced-redux-fbcea-default-rtdb.firebaseio.com/cart.json',
          {
            method: 'PUT',
            body: JSON.stringify({
                items: cart.items,
                totalQuantity: cart.totalQuantity,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error('Sending cart data failed.');
        }
      };
  
      try {
        await sendRequest();
  
        dispatch(
          uiActions.showNotification({
            status: 'success',
            title: 'Success!',
            message: 'Sent cart data successfully!',
          })
        );
      } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: 'error',
            title: 'Error!',
            message: 'Sending cart data failed!',
          })
        );
      }
    };
  };