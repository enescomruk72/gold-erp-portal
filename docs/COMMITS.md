# Semantic Commit Kuralları

Tüm commit mesajları [Conventional Commits](https://www.conventionalcommits.org/) formatında yazılır.

## Format

```
<type>(<scope>): <açıklama>

[opsiyonel gövde]
```

## Tipler

| Tip       | Açıklama |
|----------|----------|
| **feat** | Kullanıcıya yönelik yeni özellik (build script değil) |
| **fix**  | Kullanıcıya yönelik bug düzeltmesi |
| **docs** | Dokümantasyon değişiklikleri |
| **style**| Formatlama, noktalı virgül vb.; production kodu değişmez |
| **refactor** | Production kodu refaktörü (örn. değişken adı değişikliği) |
| **test**  | Eksik test ekleme, test refaktörü; production kodu değişmez |
| **chore** | Build, task, bağımlılık güncellemesi vb. |

## Örnekler

```bash
feat(auth): login sayfası ve oturum yönetimi
fix(dashboard): tablo sıralama hatası
docs: README kurulum adımları güncellendi
style: prettier ile format
refactor(api): fetch helper tekrar kullanılacak şekilde sadeleştirildi
test(auth): login form validasyon testleri
chore: commitlint ve husky eklendi
```

## Hiyerarşik commit sırası (alttan yukarıya)

Büyük değişiklikleri commit’lerken bağımlılık sırasına göre (foundation → app) ilerleyin:

| Sıra | Katman | Örnek |
|------|--------|--------|
| 1 | **chore** (tooling) | commitlint, husky, docs |
| 2 | **types & constants** | shared types, navigation constants |
| 3 | **config** | env, auth, tanstack-query |
| 4 | **lib** | utils, api client, auth, animations |
| 5 | **hooks** | use-mobile, vb. |
| 6 | **stores** | page-header store, vb. |
| 7 | **providers** | next-auth, theme, query, nuqs |
| 8 | **shared components** | data-table, data-grid, breadcrumb |
| 9 | **layout components** | sidebar, header, root layout |
| 10 | **ui components** | shadcn/ui primitives |
| 11 | **proxy / infra** | API proxy |
| 12 | **features** | cart, products, orders, iam |
| 13 | **app** | routes, pages, layout |
| 14 | **chore** (assets) | public görseller, logolar |

## Doğrulama

`git commit` sırasında mesaj otomatik olarak commitlint ile kontrol edilir. Geçersiz format commit’i engeller.
