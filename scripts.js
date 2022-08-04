create index product_id on products(id)

create index features_id on features(id)
create index features_product_id features(product_id)

create index photos_id on photos(id)
create index photos_style_id photos(style_id)

create index related_id on related(id)
create index related_current_id related(current_product_id)
create index related_related_id related(related_product_id)

create index skus_id on skus(id)
create index skus_style_id skus(style_id)

create index styles_id on styles(id)
create index styles_product_id styles(product_id)