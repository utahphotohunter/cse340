INSERT INTO public.account (
		account_firstname,
		account_lastname,
		account_email,
		account_password
	)
VALUES (
		'Tony',
		'Stark',
		'tony@starknet.com',
		'Iam1ronM@n'
	);
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
	AND account_lastname = 'Stark';
DELETE FROM account
WHERE account_firstname = 'Tony'
	AND account_lastname = 'Stark';
UPDATE inventory
SET inv_description = REPLACE(
		inv_description,
		'small interiors',
		'a huge interior'
	)
WHERE inv_id = 10;
SELECT inventory.inv_make,
	inventory.inv_model,
	classification.classification_name
FROM inventory
	INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');