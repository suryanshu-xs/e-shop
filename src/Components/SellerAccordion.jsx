import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SellerAccordion() {
    return (
        <div className='sellerAccordion'>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>How to Create a Seller Account?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        By just one click.
                        Click the activate seller button in the form section and fill in the form.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>What are the benefits?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        You can sell your products online. All you have to do is list the product details properly.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel3a-header"
                >
                    <Typography> How your product will be deliverd? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Our logistics courier partner will pick up the product from your store and deliver it to the customer.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel3a-header"
                >
                    <Typography> How will you get paid? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        
                        We will pay you after the product is deliverd to the customer. That is after customer is fully staisfied with your product.

                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel3a-header"
                >
                    <Typography> How much will you get paid? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        
                        Your get paid 95% of actual price listed on your product.

                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}