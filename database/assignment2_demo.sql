SELECT * FROM account;



INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

SELECT * FROM account;



UPDATE account
SET account_type='Admin'
WHERE account_id=1;

SELECT * FROM account;



DELETE FROM account WHERE account_id=1;

SELECT * FROM account;



SELECT * FROM inventory WHERE inv_model = 'Hummer';



UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id=10;

SELECT * FROM inventory WHERE inv_model = 'Hummer';



SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;



SELECT inv_image, inv_thumbnail FROM inventory;



UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'), 
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

SELECT inv_image, inv_thumbnail FROM inventory;