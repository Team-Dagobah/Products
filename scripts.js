CREATE INDEX product_id on products(id)

create index features_id on features(id)
create index features_product_id on features(product_id)

create index photos_id on photos(id)
create index photos_style_id on photos(style_id)

create index related_id on related(id)
create index related_current_id on related(current_product_id)
create index related_related_id on related(related_product_id)

create index skus_id on skus(id)
create index skus_style_id on skus(style_id)

create index styles_id on styles(id)
create index styles_product_id on styles(product_id)