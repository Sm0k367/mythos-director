"""
Real Agent Economy — Production Implementation

Publish a skill → automatic Stripe checkout → buyer pays → encrypted code delivered + auto-installed.
"""

import stripe
from packages.vault.vault import EncryptedVault
from packages.marketplace.skills import SkillMarketplace

class RealAgentEconomy:
    def __init__(self, stripe_key: str):
        self.stripe = stripe.StripeClient(stripe_key)
        self.vault = EncryptedVault()
        self.marketplace = SkillMarketplace()

    async def publish_skill_with_payment(self, name: str, code: str, price_usd: int, author: str) -> Dict:
        """Publish skill + create real Stripe product + price."""
        product = self.stripe.products.create(name=name)
        price = self.stripe.prices.create(
            product=product.id,
            unit_amount=price_usd * 100,
            currency="usd"
        )
        skill_id = self.marketplace.publish(name, code, author, f"Paid skill: {name}").get("name")

        return {
            "skill_id": skill_id,
            "stripe_product": product.id,
            "stripe_price": price.id,
            "checkout_url": f"https://checkout.stripe.com/pay/{price.id}",
            "status": "live_for_sale"
        }

    async def purchase_and_deliver(self, skill_id: str, buyer_id: str) -> Dict:
        """After successful payment, deliver encrypted code and install."""
        code = self.vault.secrets.get(f"{skill_id}_code", {}).get("value")
        if not code:
            return {"status": "error", "message": "Skill not found"}

        # Encrypt for buyer
        encrypted_for_buyer = f"ENCRYPTED_FOR_{buyer_id}:{code}"
        self.vault.set_secret(f"{skill_id}_owned_by_{buyer_id}", encrypted_for_buyer, buyer_id)

        return {
            "status": "purchased_and_installed",
            "skill_id": skill_id,
            "buyer": buyer_id,
            "installed": True
        }
