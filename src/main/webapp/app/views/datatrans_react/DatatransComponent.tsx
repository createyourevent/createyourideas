
import { transition } from '@angular/animations';
import React, { useState, useEffect } from 'react'
import Lightbox from '../../../content/scripts/Lightbox.js'

export interface IDatatransFormProps {
  transactionId: string;
  onLoaded: () => void;
  onOpened: () => void;
  onCancelled: () => void;
  onError: (data: string) => void
}


const Datatrans: React.FC<IDatatransFormProps> = ({transactionId, onLoaded, onOpened, onCancelled, onError}: IDatatransFormProps) => {
  const [lightbox, showLightbox] = useState(false)
  const [loading, setLoading] = useState(false)
  let [tId, setTId] = useState('')

  const onClick = () => {
    setLoading(true)
    showLightbox(true)
  }
  const onLoadedReact = () => {
    setLoading(false)
    onLoaded()
  }
  const onOpenedReact = () => {
    console.log('Opened')
    onOpened()
  }
  const onCancelledReact = () => {
    showLightbox(false)
    onCancelled()
  }
  const onErrorReact = (data) => {
    console.log('Error:', data)
    setLoading(false)
    showLightbox(false)
    onError(data)
  }

  useEffect(() => {
    if (transactionId) {
      setTId(transactionId)
    }
  }, [transactionId])

  return <div>

      {loading
        ? <span className='loader' />
        : <button className="datatrans_button" onClick={onClick} disabled={!tId}>Datatrans Terminal</button>
      }
    {lightbox && tId && <Lightbox
        transactionId={tId}
        production={false}
        onLoaded={onLoadedReact}
        onOpened={onOpenedReact}
        onCancelled={onCancelledReact}
        onError={onErrorReact}
      />
    }
</div>

}

export default Datatrans;
